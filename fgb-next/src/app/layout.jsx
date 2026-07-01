import "@/styles/globals.css";
import SiteProvider from "@/context/SiteProvider";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import LoadingOverlay from "@/components/loadingOverlay";

export const metadata = {
  title: "FGB Theaters",
  description:
    "FGB Theaters — the Capitol Theater in Montpelier and the Paramount Theater in Barre, VT. Showtimes, tickets, rentals, and more.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/favicon.png", sizes: "128x128" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteProvider>
          <div className="App">
            <NavBar />
            <LoadingOverlay />
            {children}
            <Footer />
          </div>
        </SiteProvider>
      </body>
    </html>
  );
}
