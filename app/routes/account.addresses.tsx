import type {CustomerAddressInput} from '@shopify/hydrogen/customer-account-api-types';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
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
  type Fetcher,
} from '@remix-run/react';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';
import {useState, useEffect} from 'react';
import countriesDataRaw from '~/lib/countries.json';

// Add a type for countriesData
const countriesData: Record<string, {name: string; provinces: Record<string, string>}> = countriesDataRaw as any;

export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
  deletedAddress?: string | null;
  error: Record<AddressFragment['id'], string> | null;
  updatedAddress?: AddressFragment;
};

export const meta: MetaFunction = () => {
  return [{title: 'Addresses'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    // this will ensure redirecting to login never happen for mutatation
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return data(
        {error: {[addressId]: 'Unauthorized'}},
        {
          status: 401,
        },
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address: CustomerAddressInput = {};
    const keys: (keyof CustomerAddressInput)[] = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        // handle new address creation
        try {
          const {data, errors} = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: {address, defaultAddress},
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressCreate?.userErrors?.length) {
            throw new Error(data?.customerAddressCreate?.userErrors[0].message);
          }

          if (!data?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return {
            error: null,
            createdAddress: data?.customerAddressCreate?.customerAddress,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'PUT': {
        // handle address updates
        try {
          const {data, errors} = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(data?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!data?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return {
            error: null,
            updatedAddress: address,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'DELETE': {
        // handles address deletion
        try {
          const {data, errors} = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: {addressId: decodeURIComponent(addressId)},
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressDelete?.userErrors?.length) {
            throw new Error(data?.customerAddressDelete?.userErrors[0].message);
          }

          if (!data?.customerAddressDelete?.deletedAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return {error: null, deletedAddress: addressId};
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      default: {
        return data(
          {error: {[addressId]: 'Method not allowed'}},
          {
            status: 405,
          },
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return data(
        {error: error.message},
        {
          status: 400,
        },
      );
    }
    return data(
      {error},
      {
        status: 400,
      },
    );
  }
}

export default function Addresses() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {defaultAddress, addresses} = customer;
  const [showForm, setShowForm] = useState(false);

  // Handler to collapse form after successful address creation
  function handleAddressSuccess() {
    setShowForm(false);
  }

  return (
    <div className="account-addresses">
      <h2>Addresses</h2>
      <br />
      {!addresses.nodes.length ? (
        <>
          <p>You have no addresses saved.</p>
          <button
            className="add-address-btn font-audiowide"
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
              transition: 'background 0.2s, color 0.2s, borderColor 0.2s',
              marginTop: '1.5rem',
              textTransform: 'lowercase',
            }}
            onClick={() => setShowForm((prev) => !prev)}
            aria-expanded={showForm}
            aria-controls="add-address-form"
          >
            {showForm ? 'cancel' : 'add address'}
          </button>
          {showForm && (
            <div id="add-address-form" style={{marginTop: '2rem', maxWidth: 480}}>
              <h3 className="font-audiowide" style={{marginBottom: '1rem'}}>Add Address</h3>
              <NewAddressForm onSuccess={handleAddressSuccess} />
            </div>
          )}
        </>
      ) : (
        <div>
          <button
            className="add-address-btn font-audiowide"
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
              transition: 'background 0.2s, color 0.2s, borderColor 0.2s',
              marginBottom: '1.5rem',
              textTransform: 'lowercase',
            }}
            onClick={() => setShowForm((prev) => !prev)}
            aria-expanded={showForm}
            aria-controls="add-address-form"
          >
            {showForm ? 'cancel' : 'add address'}
          </button>
          {showForm && (
            <div id="add-address-form" style={{marginTop: '2rem', maxWidth: 480}}>
              <h3 className="font-audiowide" style={{marginBottom: '1rem'}}>Add Address</h3>
              <NewAddressForm onSuccess={handleAddressSuccess} />
            </div>
          )}
          <br />
          <hr />
          <br />
          <ExistingAddresses
            addresses={addresses}
            defaultAddress={defaultAddress}
          />
        </div>
      )}
    </div>
  );
}

function NewAddressForm({onSuccess}: {onSuccess?: () => void} = {}) {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: '',
    firstName: '',
    id: 'new',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  } as CustomerAddressInput;

  const action = useActionData<ActionResponse>();
  if (action?.createdAddress && onSuccess) {
    onSuccess();
  }

  return (
    <AddressForm
      addressId={'NEW_ADDRESS_ID'}
      address={newAddress}
      defaultAddress={null}
    >
      {({stateForMethod}) => (
        <div>
          <button
            disabled={stateForMethod('POST') !== 'idle'}
            formMethod="POST"
            type="submit"
            className="font-audiowide"
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
              textTransform: 'lowercase',
              width: '100%',
            }}
          >
            {stateForMethod('POST') !== 'idle' ? 'Creating' : 'Create'}
          </button>
        </div>
      )}
    </AddressForm>
  );
}

function ExistingAddresses({
  addresses,
  defaultAddress,
}: Pick<CustomerFragment, 'addresses' | 'defaultAddress'>) {
  return (
    <div>
      <legend>Existing addresses</legend>
      {addresses.nodes.map((address) => (
        <AddressForm
          key={address.id}
          addressId={address.id}
          address={address}
          defaultAddress={defaultAddress}
        >
          {({stateForMethod}) => (
            <div>
              <button
                disabled={stateForMethod('PUT') !== 'idle'}
                formMethod="PUT"
                type="submit"
              >
                {stateForMethod('PUT') !== 'idle' ? 'Saving' : 'Save'}
              </button>
              <button
                disabled={stateForMethod('DELETE') !== 'idle'}
                formMethod="DELETE"
                type="submit"
              >
                {stateForMethod('DELETE') !== 'idle' ? 'Deleting' : 'Delete'}
              </button>
            </div>
          )}
        </AddressForm>
      ))}
    </div>
  );
}

export function AddressForm({
  addressId,
  address,
  defaultAddress,
  children,
}: {
  addressId: AddressFragment['id'];
  address: CustomerAddressInput;
  defaultAddress: CustomerFragment['defaultAddress'];
  children: (props: {
    stateForMethod: (method: 'PUT' | 'POST' | 'DELETE') => Fetcher['state'];
  }) => React.ReactNode;
}) {
  const {state, formMethod} = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;

  // --- Country/Province Dropdown Logic ---
  const [country, setCountry] = useState(address?.territoryCode || 'US');
  const [province, setProvince] = useState(address?.zoneCode || '');
  const countryList = Object.entries(countriesData).map(([code, val]) => ({code, name: val.name}));
  const provinces = countriesData[country]?.provinces || {};
  const hasProvinces = Object.keys(provinces).length > 0;

  useEffect(() => {
    // Reset province if country changes
    setProvince('');
  }, [country]);

  return (
    <Form id={addressId} className="max-w-2xl mx-auto">
      <fieldset className="border-none p-0">
        <input type="hidden" name="addressId" defaultValue={addressId} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name fields */}
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="font-exo2 text-sm font-semibold">First name<span className="text-red-500">*</span></label>
            <input
              aria-label="First name"
              autoComplete="given-name"
              defaultValue={address?.firstName ?? ''}
              id="firstName"
              name="firstName"
              placeholder="First name"
              required
              type="text"
              className="border border-gray-400 rounded px-3 py-2 font-exo2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="font-exo2 text-sm font-semibold">Last name<span className="text-red-500">*</span></label>
            <input
              aria-label="Last name"
              autoComplete="family-name"
              defaultValue={address?.lastName ?? ''}
              id="lastName"
              name="lastName"
              placeholder="Last name"
              required
              type="text"
              className="border border-gray-400 rounded px-3 py-2 font-exo2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          {/* Company */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="company" className="font-exo2 text-sm font-semibold">Company</label>
            <input
              aria-label="Company"
              autoComplete="organization"
              defaultValue={address?.company ?? ''}
              id="company"
              name="company"
              placeholder="Company"
              type="text"
              className="border border-gray-400 rounded px-3 py-2 font-exo2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          {/* Address lines */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="address1" className="font-exo2 text-sm font-semibold">Address line 1<span className="text-red-500">*</span></label>
            <input
              aria-label="Address line 1"
              autoComplete="address-line1"
              defaultValue={address?.address1 ?? ''}
              id="address1"
              name="address1"
              placeholder="Address line 1"
              required
              type="text"
              className="border border-gray-400 rounded px-3 py-2 font-exo2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="address2" className="font-exo2 text-sm font-semibold">Address line 2</label>
            <input
              aria-label="Address line 2"
              autoComplete="address-line2"
              defaultValue={address?.address2 ?? ''}
              id="address2"
              name="address2"
              placeholder="Address line 2"
              type="text"
              className="border border-gray-400 rounded px-3 py-2 font-exo2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          {/* City, State, Zip */}
          <div className="flex flex-col gap-2">
            <label htmlFor="city" className="font-exo2 text-sm font-semibold">City<span className="text-red-500">*</span></label>
            <input
              aria-label="City"
              autoComplete="address-level2"
              defaultValue={address?.city ?? ''}
              id="city"
              name="city"
              placeholder="City"
              required
              type="text"
              className="border border-gray-400 rounded px-3 py-2 font-exo2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="zoneCode" className="font-exo2 text-sm font-semibold">State / Province<span className="text-red-500">*</span></label>
            {hasProvinces ? (
              <select
                id="zoneCode"
                name="zoneCode"
                value={province}
                onChange={e => setProvince(e.target.value)}
                required
                className="border border-gray-400 rounded px-3 py-2 font-exo2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="" disabled>Select province/state</option>
                {Object.entries(provinces).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            ) : (
              <input
                aria-label="State/Province"
                autoComplete="address-level1"
                defaultValue={address?.zoneCode ?? ''}
                id="zoneCode"
                name="zoneCode"
                placeholder="State / Province"
                required
                type="text"
                className="border border-gray-400 rounded px-3 py-2 font-exo2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            )}
          </div>
          {/* Zip, Country */}
          <div className="flex flex-col gap-2">
            <label htmlFor="zip" className="font-exo2 text-sm font-semibold">Zip / Postal Code<span className="text-red-500">*</span></label>
            <input
              aria-label="Zip"
              autoComplete="postal-code"
              defaultValue={address?.zip ?? ''}
              id="zip"
              name="zip"
              placeholder="Zip / Postal Code"
              required
              type="text"
              className="border border-gray-400 rounded px-3 py-2 font-exo2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="territoryCode" className="font-exo2 text-sm font-semibold">Country Code<span className="text-red-500">*</span></label>
            <select
              id="territoryCode"
              name="territoryCode"
              value={country}
              onChange={e => setCountry(e.target.value)}
              required
              className="border border-gray-400 rounded px-3 py-2 font-exo2 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="" disabled>Select country</option>
              {countryList.map(({code, name}) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
          {/* Phone */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="phoneNumber" className="font-exo2 text-sm font-semibold">Phone</label>
            <input
              aria-label="Phone Number"
              autoComplete="tel"
              defaultValue={address?.phoneNumber ?? ''}
              id="phoneNumber"
              name="phoneNumber"
              placeholder="+16135551111"
              pattern="^\\+?[1-9]\\d{3,14}$"
              type="tel"
              className="border border-gray-400 rounded px-3 py-2 font-exo2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          {/* Default address checkbox */}
          <div className="flex items-center gap-2 md:col-span-2">
            <input
              defaultChecked={isDefaultAddress}
              id="defaultAddress"
              name="defaultAddress"
              type="checkbox"
              className="accent-black w-4 h-4"
            />
            <label htmlFor="defaultAddress" className="font-exo2 text-sm">Set as default address</label>
          </div>
        </div>
        {/* Error message */}
        {error ? (
          <p className="mt-2 text-red-600 font-exo2 text-sm">
            <mark>
              <small>{error}</small>
            </mark>
          </p>
        ) : (
          <div className="my-4" />
        )}
        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          {/* Save button (always shown) */}
          <button
            type="submit"
            formMethod={addressId === 'NEW_ADDRESS_ID' ? 'POST' : 'PUT'}
            className="font-audiowide bg-black text-white rounded px-6 py-2 text-base font-bold hover:bg-white hover:text-black border-2 border-black transition-colors"
            disabled={state !== 'idle'}
          >
            {state !== 'idle' ? 'Saving...' : 'Save'}
          </button>
          {/* Delete button (only for existing addresses) */}
          {addressId !== 'NEW_ADDRESS_ID' && (
            <button
              type="submit"
              formMethod="DELETE"
              className="font-audiowide bg-white text-black rounded px-6 py-2 text-base font-bold border-2 border-black hover:bg-red-600 hover:text-white transition-colors"
              disabled={state !== 'idle'}
            >
              {state !== 'idle' ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
        {/* Render children (action buttons, etc.) if needed */}
        {typeof children === 'function' ? children({
          stateForMethod: (method) => (formMethod === method ? state : 'idle'),
        }) : null}
        {/* Success feedback */}
        {action?.createdAddress && (
          <p className="mt-2 text-green-600 font-exo2 text-sm">Address saved successfully!</p>
        )}
      </fieldset>
    </Form>
  );
}
