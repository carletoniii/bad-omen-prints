import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

export const meta: MetaFunction = () => {
  return [{title: 'Orders'}];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_ORDERS_QUERY,
    {
      variables: {
        ...paginationVariables,
      },
    },
  );

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return {customer: data.customer};
}

export default function Orders() {
  const {customer} = useLoaderData<{customer: CustomerOrdersFragment}>();
  const {orders} = customer;
  return (
    <div className="orders">
      {orders.nodes.length ? <OrdersTable orders={orders} /> : <EmptyOrders />}
    </div>
  );
}

function OrdersTable({orders}: Pick<CustomerOrdersFragment, 'orders'>) {
  return (
    <div className="acccount-orders">
      {orders?.nodes.length ? (
        <PaginatedResourceSection connection={orders}>
          {({node: order}) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders />
      )}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div>
      <p>You haven&apos;t placed any orders yet.</p>
      <br />
      <Link to="/collections" style={{ textDecoration: 'none' }}>
        <button
          className="font-audiowide lowercase"
          style={{
            background: '#111',
            color: '#fff',
            border: '2px solid transparent',
            borderRadius: '4px',
            padding: '0.5rem 1.25rem',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s, border-color 0.2s',
            marginTop: '1rem',
            marginBottom: '1rem',
            textTransform: 'lowercase',
            width: '100%',
            maxWidth: '320px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#fff', e.currentTarget.style.color = '#111', e.currentTarget.style.border = '2px solid #111')}
          onMouseLeave={e => (e.currentTarget.style.background = '#111', e.currentTarget.style.color = '#fff', e.currentTarget.style.border = '2px solid transparent')}
        >
          start shopping
        </button>
      </Link>
    </div>
  );
}

function OrderItem({order}: {order: OrderItemFragment}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  return (
    <>
      <fieldset>
        <Link to={`/account/orders/${btoa(order.id)}`}>
          <strong>#{order.number}</strong>
        </Link>
        <p>{new Date(order.processedAt).toDateString()}</p>
        <p>{order.financialStatus}</p>
        {fulfillmentStatus && <p>{fulfillmentStatus}</p>}
        <Money data={order.totalPrice} />
        <Link to={`/account/orders/${btoa(order.id)}`}>View Order →</Link>
      </fieldset>
      <br />
    </>
  );
}
