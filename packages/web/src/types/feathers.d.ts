// typings/feathers.d.ts
declare module "@feathersjs/feathers" {
  const feathers: () => any;
  export = feathers;
}

declare module "@feathersjs/rest-client" {
  const rest: (endpoint: string) => any;
  export = rest;
}
