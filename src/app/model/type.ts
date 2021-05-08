export enum Gender {
  ALL,
  MALE ,
  FEMALE,
}

export enum ResponseResult {
  SUCCESS = 'success',
  ERROR = 'error',
}

export class UserSimpleSet {
  public id: number;
  public token: string;
}

export class User {
  public id: number;
  public email_host: string;
  public email_name: string;
  public name: string;
  public last_name: string;
}

export class ResponseSet {
  public category: ResponseResult;
  public message: string;
  public description: string;
}
