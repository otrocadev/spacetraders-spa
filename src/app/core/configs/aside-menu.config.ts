import { TablerIcon } from '../../shared/types/tabler-icons';

export const navItems = [
  {
    name: 'Fleet',
    route: '/ships',
    icon: 'rocket' as TablerIcon,
    hasCount: true,
  },
  {
    name: 'Routes',
    route: '/routes',
    icon: 'route' as TablerIcon,
    hasCount: false,
  },
];
