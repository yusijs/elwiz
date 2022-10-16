export interface Column {
  Index: number;
  Scale: number;
  SecondaryValue?: any;
  IsDominatingDirection: boolean;
  IsValid: boolean;
  IsAdditionalData: boolean;
  Behavior: number;
  Name: string;
  Value: string;
  GroupHeader: string;
  DisplayNegativeValueInBlue: boolean;
  CombinedName: string;
  DateTimeForData: string;
  DisplayName: string;
  DisplayNameOrDominatingDirection: string;
  IsOfficial: boolean;
  UseDashDisplayStyle: boolean;
}

export interface Row {
  Columns: Column[];
  Name: string;
  StartTime: string;
  EndTime: string;
  DateTimeForData: string;
  DayNumber: number;
  StartTimeDate: string;
  IsExtraRow: boolean;
  IsNtcRow: boolean;
  EmptyValue: string;
  Parent?: any;
}

export interface Data {
  Rows: Row[];
  IsDivided: boolean;
  SectionNames: string[];
  EntityIDs: string[];
  DataStartdate: string;
  DataEnddate: string;
  MinDateForTimeScale: string;
  AreaChanges: any[];
  Units: string[];
  LatestResultDate: string;
  ContainsPreliminaryValues: boolean;
  ContainsExchangeRates: boolean;
  ExchangeRateOfficial?: any;
  ExchangeRatePreliminary: string;
  ExchangeUnit: string;
  DateUpdated: string;
  CombinedHeadersEnabled: boolean;
  DataType: number;
  TimeZoneInformation: number;
}

export interface ResolutionPeriod {
  Id: string;
  Resolution: number;
  Unit: number;
  PeriodNumber: number;
}

export interface ResolutionPeriodY {
  Id: string;
  Resolution: number;
  Unit: number;
  PeriodNumber: number;
}

export interface Attribute {
  Id: string;
  Name: string;
  Role: string;
  HasRoles: boolean;
  Values: string[];
}

export interface ProductType {
  Id: string;
  Attributes: Attribute[];
  Name: string;
  DisplayName: string;
}

export interface SecondaryProductType {
  Id: string;
  Attributes?: any;
  Name: string;
  DisplayName: string;
}


export interface DateRange {
  Id: string;
  DateFrom: string;
  DateTo: string;
  IsNew: boolean;
}

export interface Entity {
  ProductType: ProductType;
  SecondaryProductType: SecondaryProductType;
  SecondaryProductBehavior: number;
  Id: string;
  Name: string;
  GroupHeader: string;
  DataUpdated: string;
  Attributes: Attribute[];
  Drillable: boolean;
  DateRanges: DateRange[];
  Index: number;
  IndexForColumn: number;
  MinMaxDisabled: boolean;
  DisableNumberGroupSeparator: number;
  TimeserieID?: any;
  SecondaryTimeserieID: string;
  HasPreliminary: boolean;
  TimeseriePreliminaryID?: any;
  Scale: number;
  SecondaryScale: number;
  DataType: number;
  SecondaryDataType: number;
  LastUpdate: string;
  Unit: string;
  IsDominatingDirection: boolean;
  DisplayAsSeparatedColumn: boolean;
  EnableInChart: boolean;
  BlueNegativeValues: boolean;
}

export interface ExtraRow {
  Id: string;
  Header: string;
  ColumnProducts: string[];
}

export interface Filter {
  Id: string;
  AttributeName: string;
  Values: string[];
  DefaultValue: string;
}

export interface NtcProductType {
  Id: string;
  Attributes?: any;
  Name: string;
  DisplayName: string;
}

export interface Conf {
  Id: string;
  Name?: any;
  Published: string;
  ShowGraph: boolean;
  ResolutionPeriod: ResolutionPeriod;
  ResolutionPeriodY: ResolutionPeriodY;
  Entities: Entity[];
  TableType: number;
  ExtraRows: ExtraRow[];
  Filters: Filter[];
  IsDrillDownEnabled: boolean;
  DrillDownMode: number;
  IsMinValueEnabled: boolean;
  IsMaxValueEnabled: boolean;
  ValidYearsBack: number;
  TimeScaleUnit: string;
  IsNtcEnabled: boolean;
  NtcProductType: NtcProductType;
  NtcHeader: string;
  ShowTimelineGraph: number;
  ExchangeMode: number;
  IsPivotTable: number;
  IsCombinedHeadersEnabled: number;
  NtcFormat: number;
  DisplayHourAlsoInUKTime: boolean;
}

export interface NordPoolResponseObject {
  data: Data;
  cacheKey: string;
  conf: Conf;
}

