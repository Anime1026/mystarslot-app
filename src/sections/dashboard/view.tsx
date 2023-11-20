// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// components
import { useSettingsContext } from 'src/components/settings';
import BestCharts from './best-charts';
//

import TotalUsers from './total-users';
import TotalSiteSales from './total-site-sales';
// import BestCategories from './best-categories';
import CurrentlyTable from './currently-table';

// ----------------------------------------------------------------------
// const _ecommerceSalesOverview = ['casino', 'live casino', 'virtual', 'mini games', 'poker'].map(
//   (label, index) => ({
//     label,
//     totalAmount: (index + 1000) * 100,
//     value: index + 4 * 2,
//   })
// );

const tableData = [...Array(6)].map((_, index) => {
  const from = ['Operator1', 'fOperator2', 'Operator3', 'Operator4', 'Operator5', 'Operator6'][
    index
  ];

  const to = ['Shop6', 'user1', 'shop3', 'user4', 'shop5', 'user2'][index];

  const InAmount = [100.2335, 200, 300, 400, 500, 600][index];

  const OutAmount = [100, 200.65643, 300, 400, 500, 600][index];

  const date = [
    '10/09/2023 11:00 pm',
    '10/09/2023 11:00 pm',
    '10/09/2023 11:00 pm',
    '10/09/2023 11:00 pm',
    '10/09/2023 11:00 pm',
    '10/09/2023 11:00 pm',
  ][index];

  return {
    id: index,
    from,
    to,
    in: `${InAmount} $`,
    out: `${OutAmount} $`,
    date,
  };
});

export default function Dashboard() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Dashboard 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <TotalUsers
            title="Total"
            total={714000}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <TotalUsers
            title="Operators"
            total={1352831}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <TotalUsers
            title="Shop"
            total={1723315}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <TotalUsers
            title="Users"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <TotalSiteSales
            title="Website Visits"
            subheader="(+43%) than last year"
            chart={{
              labels: [
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ],
              series: [
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 2],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <BestCharts
            title="Best Categories"
            chart={{
              series: [
                { label: 'Pragmatic Play', value: 4344 },
                { label: 'Evolution', value: 5435 },
                { label: 'Amatic', value: 1443 },
                { label: 'NetEnt', value: 4443 },
                { label: 'Playtech', value: 4443 },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          <BestCharts
            title="Top 5 Providers"
            chart={{
              series: [
                { label: 'Operator1', value: 4344 },
                { label: 'Operator1', value: 5435 },
                { label: 'Operator1', value: 1443 },
                { label: 'Operator1', value: 4443 },
                { label: 'Operator1', value: 4443 },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          <BestCharts
            title="Top 5 Operators"
            chart={{
              series: [
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
                { label: 'Africa', value: 4443 },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          <BestCharts
            title="Top 5 Shops"
            chart={{
              series: [
                { label: 'Shop1', value: 4344 },
                { label: 'Shop1', value: 5435 },
                { label: 'Shop1', value: 1443 },
                { label: 'Shop1', value: 4443 },
                { label: 'Shop1', value: 2520 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <CurrentlyTable
            title="Lastest Transactions"
            tableData={tableData}
            tableLabels={[
              { id: '1', label: 'ID' },
              { id: '2', label: 'From' },
              { id: '3', label: 'To', align: 'center' },
              { id: '4', label: 'In', align: 'right' },
              { id: '5', label: 'Out', align: 'right' },
              { id: '6', label: 'Date', align: 'right' },
            ]}
          />
        </Grid>

        {/* <Grid xs={12} md={12} lg={12}>
          <BestCategories title="Sales Overview" data={_ecommerceSalesOverview} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
