import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './rest/rest.application.js';


const container = new Container();

container.bind<RestApplication>(RestApplication).toSelf();

export { container };
