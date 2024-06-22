export const DBConfig = {
  name: 'FileStore',
  version: 1,
  objectStoresMeta: [
    {
      store: 'files',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'filename', keypath: 'file', options: { unique: false } }
      ]
    }
  ]
};
