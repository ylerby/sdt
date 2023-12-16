export interface RealEstate {
  RealEstateID: number;
  Accommodation: number;
  DealType: number;
  Floor: number;
  FloorsCount: number;
  RoomsCount: number;
  TotalMeters: number;
  District: string;
  Street: string;
  HouseNumber: string;
  ApartmentNumber: number;
  Metro: string;
  Price: number;
  PublicationDate: string;
}

export interface GetResponse {
  Data: RealEstate[];
  RequestError: string;
}

export interface Draft {
  val: number | string;
  id: string;
}

export type Path = "/reports" | "/admin" | "/client" | "/";
