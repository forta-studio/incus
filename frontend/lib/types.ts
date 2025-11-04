// User
interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: "CUSTOMER" | "ADMIN";
  isActive: boolean;
  emailConfirmed: boolean;
  lastLogin?: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
  profileImageId?: string;
  createdAt: string;
  updatedAt: string;
  profileImage?: Image;
  orders?: Order[];
  posts?: Post[];
  sessions?: Session[];
  addresses?: Address[];
  artistsAdded?: Artist[];
  digitalDownloads?: DigitalDownload[];
}

// Session
interface Session {
  id: string;
  sid: string;
  userId?: string;
  user?: User;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  device?: string;
  browser?: string;
  isActive: boolean;
  lastActivity: string;
  loginAt: string;
  logoutAt?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

// Address
interface Address {
  id: string;
  label?: string;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  type: "SHIPPING" | "BILLING" | "BOTH";
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
  ordersShipping?: Order[];
  ordersBilling?: Order[];
}

// Artist
interface Artist {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  website?: string;
  instagram?: string;
  twitter?: string;
  spotify?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  youtubeMusicUrl?: string;
  soundcloud?: string;
  bannerImageId?: string;
  isActive: boolean;
  addedById: string;
  addedBy?: User;
  createdAt: string;
  updatedAt: string;
  bannerImage?: Image;
  releases?: Release[];
  images?: Image[];
}

// Image
interface Image {
  id: string;
  filename: string;
  originalName: string;
  alt?: string;
  width?: number;
  height?: number;
  filesize?: number;
  mimeType?: string;
  order?: number;
  bucketName: string;
  key: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  userProfile?: User;
  artistBanner?: Artist;
  releaseBanner?: Release;
  postBanner?: Post;
  releases?: Release[];
  artists?: Artist[];
  products?: Product[];
  postId?: string;
  post?: Post;
}

// Track
interface Track {
  id: string;
  title: string;
  trackNumber: number;
  duration?: number;
  audioUrl?: string;
  playable: boolean;
  audioFileId?: string;
  createdAt: string;
  updatedAt: string;
  releaseId: string;
  release?: Release;
  audioFile?: AudioFile;
}

// AudioFile  (for tracks)
interface AudioFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  filesize: number;
  duration?: number;
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
  bucketName: string;
  key: string;
  url: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  tracks?: Track[];
}

// Product
interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: string;
  isDigital: boolean;
  downloadUrl?: string;
  stockQuantity?: number;
  isActive: boolean;
  isFeatured: boolean;
  type: "RELEASE" | "SAMPLE_PACK" | "MERCH";
  createdAt: string;
  updatedAt: string;
  releaseId?: string;
  release?: Release;
  images?: Image[];
  categories?: ProductCategory[];
  orderItems?: OrderItem[];
  digitalDownloads?: DigitalDownload[];
}

// Category
interface Category {
  id: string;
  name: string;
  slug: string;
  type: "CLOTHING_TYPE" | "SIZE" | "COLOR" | "MUSIC_GENRE";
  createdAt: string;
  updatedAt: string;
  products?: ProductCategory[];
}

// ProductCategory (many-to-many)
interface ProductCategory {
  id: string;
  productId: string;
  categoryId: string;
  createdAt: string;
  product?: Product;
  category?: Category;
}

// Release interface with all relations
interface Release {
  id: string;
  title: string;
  slug: string;
  displayArtist: string;
  releaseDate?: string;
  type: "ALBUM" | "EP" | "SINGLE";
  description?: string;
  spotifyUrl?: string;
  addToPlaylistUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  youtubeMusicUrl?: string;
  soundcloudUrl?: string;
  bannerImageId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  artistId: string;
  artist?: Artist;
  bannerImage?: Image;
  images?: Image[];
  tracks?: Track[];
  products?: Product[];
}

// Order
interface Order {
  id: string;
  orderNumber: string;
  status:
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";
  totalAmount: string;
  shippingCost: string;
  tax: string;
  paymentMethod?: string;
  paymentIntentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  user?: User;
  items?: OrderItem[];
  discounts?: DiscountCode[];
  shippingAddressId?: string;
  shippingAddress?: Address;
  billingAddressId?: string;
  billingAddress?: Address;
}

// OrderItem
interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  orderId: string;
  order?: Order;
  productId: string;
  product?: Product;
  digitalDownloads?: DigitalDownload[];
}

// Post
interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  bannerImageId?: string;
  createdAt: string;
  updatedAt: string;
  authorId?: string;
  author?: User;
  bannerImage?: Image;
  tags?: Tag[];
  images?: Image[];
}

// Tag
interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  posts?: Post[];
}

// DiscountCode
interface DiscountCode {
  id: string;
  code: string;
  description?: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  discountPercent?: string;
  discountAmount?: string;
  minimumAmount?: string;
  usageLimit?: number;
  timesUsed: number;
  isActive: boolean;
  validFrom: string;
  validTo?: string;
  createdAt: string;
  updatedAt: string;
  orders?: Order[];
}

// DigitalDownload
interface DigitalDownload {
  id: string;
  downloadToken: string;
  downloadUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  maxDownloads: number;
  downloadCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  orderItemId?: string;
  orderItem?: OrderItem;
  productId: string;
  product?: Product;
  userId?: string;
  user?: User;
  downloadFileId?: string;
  downloadFile?: DownloadFile;
}

// DownloadFile
interface DownloadFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  filesize: number;
  bucketName: string;
  key: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  digitalDownloads?: DigitalDownload[];
}

export type {
  User,
  Session,
  Address,
  Artist,
  Image,
  Track,
  AudioFile,
  Product,
  Category,
  ProductCategory,
  Release,
  Order,
  OrderItem,
  Post,
  Tag,
  DiscountCode,
  DigitalDownload,
  DownloadFile
};