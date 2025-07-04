import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data?.page) {
    return [
      { title: "Page Not Found | Bad Omen Prints" },
      { name: "description", content: "Sorry, this page could not be found." }
    ];
  }
  // Prefer SEO description, otherwise use the first 160 chars of the body (stripped of HTML)
  let description = data.page.seo?.description;
  if (!description) {
    if (typeof document !== 'undefined') {
      const tmp = document.createElement('div');
      tmp.innerHTML = data.page.body || '';
      description = tmp.textContent?.slice(0, 160) || '';
    } else {
      // fallback for SSR: strip HTML tags with regex
      description = (data.page.body || '').replace(/<[^>]+>/g, '').slice(0, 160);
    }
  }
  return [
    { title: `${data.page.title} | Bad Omen Prints` },
    { name: "description", content: description || 'Read more from Bad Omen Prints.' },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  request,
  params,
}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

  return {
    page,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div className="page">
      <header>
        <h1>{page.title}</h1>
      </header>
      <main dangerouslySetInnerHTML={{__html: page.body}} />
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
