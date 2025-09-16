"use client";

import { useEffect } from "react";

type SwaggerUIBundle = {
  (config: {
    url: string;
    dom_id: string;
    presets: unknown[];
    layout: string;
    docExpansion: string;
    defaultModelsExpandDepth: number;
  }): void;
  presets?: {
    apis: unknown;
  };
};

declare global {
  interface Window {
    SwaggerUIBundle?: SwaggerUIBundle;
  }
}

const SWAGGER_CSS_ID = "swagger-ui-css";
const SWAGGER_SCRIPT_ID = "swagger-ui-script";

export default function ApiDocsPage() {
  useEffect(() => {
    if (!document.getElementById(SWAGGER_CSS_ID)) {
      const link = document.createElement("link");
      link.id = SWAGGER_CSS_ID;
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css";
      document.head.appendChild(link);
    }

    const initializeSwagger = () => {
      if (!window.SwaggerUIBundle) return;
      const apisPreset = window.SwaggerUIBundle.presets?.apis;
      window.SwaggerUIBundle({
        url: "/api/swagger",
        dom_id: "#swagger-ui",
        presets: apisPreset ? [apisPreset] : [],
        layout: "BaseLayout",
        docExpansion: "none",
        defaultModelsExpandDepth: -1,
      });
    };

    const existingScript = document.getElementById(
      SWAGGER_SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (window.SwaggerUIBundle) {
      initializeSwagger();
      return;
    }

    const script =
      existingScript ?? document.createElement("script");

    if (!existingScript) {
      script.id = SWAGGER_SCRIPT_ID;
      script.src =
        "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js";
      script.async = true;
      document.body.appendChild(script);
    }

    script.addEventListener("load", initializeSwagger);

    return () => {
      script.removeEventListener("load", initializeSwagger);
      const uiRoot = document.getElementById("swagger-ui");
      if (uiRoot) {
        uiRoot.innerHTML = "";
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-white px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-3xl font-semibold text-gray-900">
          VocAI API 문서
        </h1>
        <p className="mb-6 text-gray-600">
          아래에서 OpenAPI 사양과 상호작용하며 API를 테스트할 수 있습니다.
        </p>
        <div id="swagger-ui" className="bg-white shadow-sm" />
      </div>
    </main>
  );
}
