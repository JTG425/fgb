import { AppsyncFunction, MappingTemplate, type CfnResolver } from 'aws-cdk-lib/aws-appsync';
import { fileURLToPath } from 'node:url';
import type { Backend } from '../backend';

// Keep the Gen 1 preAuth validation in the generated Gen 2 mutation pipeline.
export function attachPosterRequestValidation(backend: Backend) {
  const api = backend.data.resources.graphqlApi;
  const validation = new AppsyncFunction(backend.data.stack, 'ValidatePosterRequest', {
    name: 'ValidatePosterRequest',
    api,
    dataSource: api.addNoneDataSource('PosterRequestValidation'),
    requestMappingTemplate: MappingTemplate.fromFile(fileURLToPath(new URL(
      './resolvers/Mutation.createPosterRequest.preAuth.1.req.vtl', import.meta.url,
    ))),
    responseMappingTemplate: MappingTemplate.fromFile(fileURLToPath(new URL(
      './resolvers/Mutation.createPosterRequest.preAuth.1.res.vtl', import.meta.url,
    ))),
  });
  const resolver = backend.data.resources.cfnResources.cfnResolvers['Mutation.createPosterRequest'];
  if (!resolver || resolver.kind !== 'PIPELINE') {
    throw new Error('Poster requests must have a validated mutation pipeline.');
  }
  const pipeline = resolver.pipelineConfig as CfnResolver.PipelineConfigProperty;
  resolver.pipelineConfig = { functions: [validation.functionId, ...(pipeline.functions ?? [])] };
}
