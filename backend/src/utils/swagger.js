import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"

const swaggerDocument = YAML.load("./src/swagger/docs.yaml")

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  console.log("✅ Swagger Docs: http://localhost:5000/api-docs")
}
