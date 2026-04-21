import { Observability, DefaultExporter } from "@mastra/observability";

export const observability = new Observability({
  configs: {
    default: {
      serviceName: "mastra",
      exporters: [
        new DefaultExporter()
      ],
    },
  },
});
