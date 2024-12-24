import path from "path";
import getEnv from "../config/env.config";

const { FE_ADMIN_URL, FE_CLIENT_URL } = getEnv();
export function generateClientUrl(...subPaths: string[]) {
  return generateFrontendUrl(FE_CLIENT_URL, ...subPaths);
}

export function generateAdminUrl(...subPaths: string[]) {
  return generateFrontendUrl(FE_ADMIN_URL, ...subPaths);
}

function generateFrontendUrl(homeUrl: string, ...subPaths: string[]) {
  const home = homeUrl.endsWith("/") ? homeUrl.slice(0, -1) : homeUrl;

  const subPath = path.join(...subPaths);

  const subUrl = subPath.startsWith("/") ? subPath.slice(1) : subPath;

  return `${home}/${subUrl}`;
}

export default generateFrontendUrl;
