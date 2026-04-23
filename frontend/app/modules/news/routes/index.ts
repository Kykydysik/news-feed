import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout(
      'shared/layout/CenterContent.tsx',
      [index('modules/news/pages/NewsFeed.tsx')],
  )
] satisfies RouteConfig;
