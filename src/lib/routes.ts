/** Canonical URL builders for the spatial hierarchy. Keep URLs semantic and shareable. */

export const routes = {
  home: () => "/",
  city: (city: string) => `/${city}`,
  district: (city: string, district: string) => `/${city}/${district}`,
  project: (city: string, district: string, project: string) =>
    `/${city}/${district}/${project}`,
  building: (city: string, district: string, project: string, buildingId: string) =>
    `/${city}/${district}/${project}/building/${buildingId}`,
  floor: (
    city: string,
    district: string,
    project: string,
    buildingId: string,
    floorId: string
  ) => `/${city}/${district}/${project}/building/${buildingId}/floor/${floorId}`,
  unit: (
    city: string,
    district: string,
    project: string,
    buildingId: string,
    floorId: string,
    unitId: string
  ) =>
    `/${city}/${district}/${project}/building/${buildingId}/floor/${floorId}/unit/${unitId}`,
  saved: () => "/saved",
  compare: () => "/compare",
  enquiries: () => "/enquiries",
  signIn: () => "/signin",
  sales: () => "/sales",
  salesManager: () => "/sales/manager",
  admin: () => "/admin",
  system: () => "/admin/system",
};
