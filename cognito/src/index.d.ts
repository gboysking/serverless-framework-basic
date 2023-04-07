import express, { Request } from "express";

declare module "express" {
    interface Request {
        apiGateway?: {
            event: any;
            context: any;
        };
    }
}