declare module 'mongoose-schema-jsonschema' {
  import { Mongoose } from 'mongoose';
  function plugin(mongoose: Mongoose): void;
  export default plugin;
}