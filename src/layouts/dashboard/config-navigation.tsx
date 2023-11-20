import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// components
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'overview',
        items: [
          { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
          { title: 'User Tree', path: paths.dashboard.usertree, icon: ICONS.ecommerce },
          {
            title: 'Games Statics',
            path: paths.dashboard.gamestatics,
            icon: ICONS.analytics,
          },
          {
            title: 'Transaction',
            path: paths.dashboard.transaction,
            icon: ICONS.tour,
          },
          {
            title: 'Commission Stats',
            path: paths.dashboard.commission,
            icon: ICONS.banking,
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'management',
        items: [
          {
            title: 'Operators',
            path: paths.operator.index,
            icon: ICONS.kanban,
            children: [
              { title: 'List', path: paths.operator.list },
              { title: 'Create', path: paths.operator.create },
            ],
          },
          {
            title: 'Shops',
            path: paths.shop.index,
            icon: ICONS.order,
            children: [
              { title: 'List', path: paths.shop.list },
              { title: 'Create', path: paths.shop.create },
            ],
          },
          {
            title: 'Users',
            path: paths.user.index,
            icon: ICONS.user,
          },
          {
            title: 'Profile',
            path: paths.profile.index,
            icon: ICONS.job,
          },
        ],
      },
    ],
    []
  );

  return data;
}
