import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [...nextCoreWebVitals, { ignores: ['out/**', '.next/**'] }];

export default eslintConfig;
