/**
 * Data provider factory — THE single swap point for the backend.
 *
 * The service layer imports `getProvider()`; UI components never touch this
 * file. To migrate off mock data, implement the `DataProvider` contract in a
 * new module and add a branch below. No UI or service code changes.
 *
 * Roadmap of providers (see .env.example NEXT_PUBLIC_DATA_SOURCE):
 *   mock        -> ./mock                     (implemented)
 *   rest        -> ./rest        (REST API)          [future]
 *   prisma      -> ./prisma      (PostgreSQL)        [future, server-only]
 *   mssql       -> ./mssql       (SQL Server)        [future, server-only]
 *   sharepoint  -> ./sharepoint  (Graph Lists)       [future, server-only]
 *   excel       -> ./excel       (Graph Workbook)    [future, server-only]
 *   sap         -> ./sap         (OData/BAPI)        [future, server-only]
 */
import type { DataProvider } from "../contracts";
import { mockProvider } from "./mock";

export type DataSourceName =
  | "mock"
  | "rest"
  | "prisma"
  | "mssql"
  | "sharepoint"
  | "excel"
  | "sap";

let cached: DataProvider | null = null;

function resolveProviderName(): DataSourceName {
  return (process.env.NEXT_PUBLIC_DATA_SOURCE as DataSourceName) || "mock";
}

function createProvider(name: DataSourceName): DataProvider {
  switch (name) {
    case "mock":
      return mockProvider;

    // Each future provider is a lazy require so its (server-only) deps never
    // ship to the client bundle. Uncomment as each is implemented.
    // case "rest":       return require("./rest").restProvider;
    // case "prisma":     return require("./prisma").prismaProvider;
    // case "mssql":      return require("./mssql").mssqlProvider;
    // case "sharepoint": return require("./sharepoint").sharepointProvider;
    // case "excel":      return require("./excel").excelProvider;
    // case "sap":        return require("./sap").sapProvider;

    default:
      // eslint-disable-next-line no-console
      console.warn(
        `[data] provider "${name}" is not implemented yet; falling back to mock.`,
      );
      return mockProvider;
  }
}

/** Returns the active data provider (memoised per runtime). */
export function getProvider(): DataProvider {
  if (!cached) cached = createProvider(resolveProviderName());
  return cached;
}
