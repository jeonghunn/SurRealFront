import { DateTime } from 'luxon';

export enum Gender {
  ALL,
  MALE ,
  FEMALE,
}

export enum ChatSpaceCategory {
  ROOM,
  CHAT,
  LIVE,
}

export enum CommunicationType {
  AUTH,
  CHAT,
  LIVE,
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
  public email_host?: string;
  public email_name?: string;
  public name?: string;
  public last_name?: string;
  public relation?: Relation;
}

export class Relation {
  public id: number;
  public category: RelationCategory;
  public status: RelationStatus;
  public target?: User;
  public user_id: number;
  public target_id: number;
}

export class Communication {
  public T: CommunicationType;
  public createdAt?: DateTime;

  public constructor(
    type: CommunicationType,
    createdAt: string,
  ) {
    this.T = type;
    this.createdAt = DateTime.fromISO(createdAt);
  }
}

export class CommunicationResult extends Communication {

  public result?: boolean;
  public message?: string;

  public constructor(
    type: CommunicationType,
    isSuccess: boolean,
    message: string,
    date: DateTime,
  ) {
    super(type, date);
    this.result = isSuccess;
    this.message = message;
  }

}

export class Chat extends Communication {

  public id?: number;
  public content: string;
  public user?: User;

  public constructor(
    id: number,
    content: string,
    createdAt: string,
    user: User,
  ) {
    super(CommunicationType.CHAT, createdAt);
    this.id = id;
    this.content = content;
    this.user = user;
  }

}

export class AuthMessage extends Communication {

  public token?: string;
  public constructor(
    token: string,
  ) {
    super(CommunicationType.AUTH, null);
    this.token = token;
  }
}

export class Live extends Communication {
  public B: any;
}

export class Group {
  public id: number;
  public name: string;
  public user_id: number;
  public target_id: number;
  public target?: User;
}

export class Room {
  public id: number;
  public name: string;
  public description: string;
  public user?: User;
  public group: Group;
  public online_count: number;
  public limit: number;
  public status: number;

}

export enum RelationCategory {
  FRIEND,
  BLOCKED,
}

export enum RelationStatus {
  NORMAL,
  REMOVED,
  PENDING,
  REQUEST_RECEIVED,
}

export class ResponseSet {
  public category: ResponseResult;
  public message: string;
  public description: string;
}
