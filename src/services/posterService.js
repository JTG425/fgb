import { generateClient } from "aws-amplify/api";
import { validateRequest } from "../lib/posters";
import { isAmplifyConfigured } from "../amplify";

const posterFields = `id catalogNumber title year posterType size condition estimatedValue askingPrice quantity storageLocation provenance description dateAcquired active createdAt updatedAt`;

// IAM uses the existing Cognito identity pool, without an expiring public API key.
async function query(document, variables = {}) {
  if (!isAmplifyConfigured) throw new Error("The poster service has not been configured yet.");
  const result = await generateClient().graphql({ query: document, variables, authMode: "iam" });
  if (result.errors?.length) throw new Error("The poster service could not complete this request.");
  return result.data;
}

async function listAll(model, fields) {
  const items = [];
  let nextToken = null;
  do {
    const data = await query(`query List${model}($nextToken: String) { list${model}(limit: 100, nextToken: $nextToken) { items { ${fields} } nextToken } }`, { nextToken });
    items.push(...data[`list${model}`].items.filter(Boolean));
    nextToken = data[`list${model}`].nextToken;
  } while (nextToken);
  return items;
}

export const loadPosterOverrides = () => listAll("PosterListings", posterFields);

export async function submitPosterRequest(input) {
  const error = validateRequest(input);
  if (error) throw new Error(error);
  const data = await query(`mutation RequestPoster($input: CreatePosterRequestInput!) { createPosterRequest(input: $input) { id } }`, {
    input: {
      id: input.id, posterId: input.posterId, posterTitle: input.posterTitle,
      catalogNumber: input.catalogNumber, customerName: input.customerName.trim(),
      phone: input.phone.trim(), comments: input.comments.trim(), status: "NEW",
    },
  });
  return data.createPosterRequest;
}
