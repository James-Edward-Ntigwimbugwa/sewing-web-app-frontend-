import { Injectable } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';


export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
