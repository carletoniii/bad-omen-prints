import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type MetaFunction,
} from '@remix-run/react';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
    };
  } catch (error: any) {
    return data(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  return (
    <div className="account-profile">
      <h2>My profile</h2>
      <br />
      <Form method="PUT">
        <legend>Personal information</legend>
        <fieldset>
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            aria-label="First name"
            defaultValue={customer.firstName ?? ''}
            minLength={2}
          />
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
            aria-label="Last name"
            defaultValue={customer.lastName ?? ''}
            minLength={2}
          />
        </fieldset>
        {action?.error ? (
          <p>
            <mark>
              <small>{action.error}</small>
            </mark>
          </p>
        ) : (
          <br />
        )}
        <button
          type="submit"
          disabled={state !== 'idle'}
          className="font-audiowide lowercase"
          style={{
            background: state !== 'idle' ? '#eee' : '#111',
            color: state !== 'idle' ? '#aaa' : '#fff',
            border: state !== 'idle' ? '2px solid #eee' : '2px solid transparent',
            borderRadius: '4px',
            padding: '0.5rem 1.25rem',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            letterSpacing: '0.05em',
            cursor: state !== 'idle' ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, color 0.2s, border-color 0.2s',
            marginTop: '1rem',
            marginBottom: '1rem',
            textTransform: 'lowercase',
            width: '100%',
            maxWidth: '320px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            opacity: state !== 'idle' ? 0.7 : 1,
          }}
          onMouseEnter={e => { if(state === 'idle'){ e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#111'; e.currentTarget.style.border = '2px solid #111'; }}}
          onMouseLeave={e => { if(state === 'idle'){ e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.border = '2px solid transparent'; }}}
        >
          {state !== 'idle' ? 'Updating' : 'Update'}
        </button>
      </Form>
    </div>
  );
}
