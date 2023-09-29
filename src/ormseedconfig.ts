import config from './ormconfig';

const ormseedconfig = {
...config,
migrations: ['src/seeds/*.ts']
};

export default ormseedconfig;
