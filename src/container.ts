import 'reflect-metadata';
import { Container } from 'inversify';
import { Application } from './app/application.js';


const container = new Container();

container.bind<Application>(Application).toSelf();

export { container };
