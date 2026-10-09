import algoliasearch from 'algoliasearch';

// Initialize Algolia client
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!
);

// Index name for products
export const PRODUCTS_INDEX = 'products';

// Get the products index
export const productsIndex = client.initIndex(PRODUCTS_INDEX);

// Format product for Algolia indexing
export function formatProductForAlgolia(product: any) {
  return {
    objectID: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    comparePrice: product.comparePrice,
    images: product.images,
    categoryId: product.categoryId,
    categoryName: product.category?.name,
    categorySlug: product.category?.slug,
    featured: product.featured,
    isActive: product.isActive,
    inStock: product.inventory?.quantity > 0,
    stockQuantity: product.inventory?.quantity || 0,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    // Additional searchable fields
    _tags: [
      product.category?.name,
      product.featured ? 'featured' : null,
      product.inventory?.quantity > 0 ? 'in-stock' : 'out-of-stock',
    ].filter(Boolean),
  };
}

// Sync a single product to Algolia
export async function syncProductToAlgolia(product: any) {
  try {
    const formattedProduct = formatProductForAlgolia(product);
    await productsIndex.saveObject(formattedProduct);
    console.log(`✅ Product synced to Algolia: ${product.name}`);
  } catch (error) {
    console.error('❌ Failed to sync product to Algolia:', error);
    throw error;
  }
}

// Sync multiple products to Algolia
export async function syncProductsToAlgolia(products: any[]) {
  try {
    const formattedProducts = products.map(formatProductForAlgolia);
    await productsIndex.saveObjects(formattedProducts);
    console.log(`✅ ${products.length} products synced to Algolia`);
  } catch (error) {
    console.error('❌ Failed to sync products to Algolia:', error);
    throw error;
  }
}

// Delete a product from Algolia
export async function deleteProductFromAlgolia(productId: string) {
  try {
    await productsIndex.deleteObject(productId);
    console.log(`✅ Product deleted from Algolia: ${productId}`);
  } catch (error) {
    console.error('❌ Failed to delete product from Algolia:', error);
    throw error;
  }
}

// Search products in Algolia
export async function searchProducts(query: string, options: {
  page?: number;
  hitsPerPage?: number;
  filters?: string;
  facets?: string[];
} = {}) {
  try {
    const { page = 0, hitsPerPage = 20, filters, facets } = options;
    
    const result = await productsIndex.search(query, {
      page,
      hitsPerPage,
      filters,
      facets,
      attributesToRetrieve: [
        'objectID',
        'name',
        'slug',
        'description',
        'price',
        'comparePrice',
        'images',
        'categoryName',
        'categorySlug',
        'featured',
        'inStock',
        'stockQuantity',
      ],
      attributesToHighlight: ['name', 'description'],
      typoTolerance: true,
      removeWordsIfNoResults: 'lastWords',
    });

    return {
      hits: result.hits,
      total: result.nbHits,
      pages: result.nbPages,
      page: result.page,
      query: result.query,
    };
  } catch (error) {
    console.error('❌ Algolia search failed:', error);
    throw error;
  }
}

// Configure Algolia index settings
export async function configureAlgoliaIndex() {
  try {
    await productsIndex.setSettings({
      // Searchable attributes (in order of importance)
      searchableAttributes: [
        'name',
        'description',
        'categoryName',
      ],
      // Attributes for faceting (filtering)
      attributesForFaceting: [
        'categoryName',
        'categorySlug',
        'featured',
        'inStock',
        'price',
      ],
      // Custom ranking (after relevance)
      customRanking: [
        'desc(featured)',
        'desc(inStock)',
        'asc(price)',
      ],
      // Highlight settings
      attributesToHighlight: ['name', 'description'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
      // Typo tolerance
      typoTolerance: true,
      minWordSizefor1Typo: 4,
      minWordSizefor2Typos: 8,
      // Pagination
      hitsPerPage: 20,
      maxValuesPerFacet: 100,
      // Distinct
      attributeForDistinct: 'slug',
      distinct: 1,
    });

    console.log('✅ Algolia index settings configured');
  } catch (error) {
    console.error('❌ Failed to configure Algolia index:', error);
    throw error;
  }
}
