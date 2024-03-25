import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CacheService {
  save(key: string, data: any, expirationInMinutes: number): void {
    const record = {
      value: data,
      expiration: new Date().getTime() + expirationInMinutes * 60000,
    };
    localStorage.setItem(key, JSON.stringify(record));
  }

  load(key: string): any {
    const item = localStorage.getItem(key);
    if (item !== null) {
      const record = JSON.parse(item);
      const now = new Date().getTime();
      if (now < record.expiration) {
        return record.value;
      } else {
        localStorage.removeItem(key);
      }
    }
    return null;
  }
}
