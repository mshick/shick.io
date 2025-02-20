/**
 * @link https://github.com/decaporg/decap-cms/blob/main/packages/decap-cms-core/src/types/redux.ts
 */
export type CmsBackendType =
  | 'azure'
  | 'git-gateway'
  | 'github'
  | 'gitlab'
  | 'gitea'
  | 'bitbucket'
  | 'test-repo'
  | 'proxy';

export type CmsMapWidgetType = 'Point' | 'LineString' | 'Polygon';

export type CmsMarkdownWidgetButton =
  | 'bold'
  | 'italic'
  | 'code'
  | 'link'
  | 'heading-one'
  | 'heading-two'
  | 'heading-three'
  | 'heading-four'
  | 'heading-five'
  | 'heading-six'
  | 'quote'
  | 'code-block'
  | 'bulleted-list'
  | 'numbered-list';

export interface CmsSelectWidgetOptionObject {
  label: string;
  value: unknown;
}

export enum CmsCollectionFormatType {
  YML = 'yml',
  YAML = 'yaml',
  TOML = 'toml',
  JSON = 'json',
  Frontmatter = 'frontmatter',
  YAMLFrontmatter = 'yaml-frontmatter',
  TOMLFrontmatter = 'toml-frontmatter',
  JSONFrontmatter = 'json-frontmatter',
}

export type CmsAuthScope = 'repo' | 'public_repo';

export type CmsPublishMode = 'simple' | 'editorial_workflow';

export type CmsSlugEncoding = 'unicode' | 'ascii';

export interface CmsI18nConfig {
  structure: 'multiple_folders' | 'multiple_files' | 'single_file';
  locales: string[];
  default_locale?: string;
}

export interface CmsFieldBase {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
  pattern?: [string, string];
  i18n?: boolean | 'translate' | 'duplicate' | 'none';
  media_folder?: string;
  public_folder?: string;
  comment?: string;
}

export interface CmsFieldBoolean {
  widget: 'boolean';
  default?: boolean;
}

export interface CmsFieldCode {
  widget: 'code';
  default?: unknown;

  default_language?: string;
  allow_language_selection?: boolean;
  keys?: { code: string; lang: string };
  output_code_only?: boolean;
}

export interface CmsFieldColor {
  widget: 'color';
  default?: string;

  allowInput?: boolean;
  enableAlpha?: boolean;
}

export interface CmsFieldDateTime {
  widget: 'datetime';
  default?: string;

  format?: string;
  date_format?: boolean | string;
  time_format?: boolean | string;
  picker_utc?: boolean;

  /**
   * @deprecated Use date_format instead
   */
  dateFormat?: boolean | string;
  /**
   * @deprecated Use time_format instead
   */
  timeFormat?: boolean | string;
  /**
   * @deprecated Use picker_utc instead
   */
  pickerUtc?: boolean;
}

export interface CmsFieldFileOrImage {
  widget: 'file' | 'image';
  default?: string;

  media_library?: CmsMediaLibrary;
  allow_multiple?: boolean;
  config?: unknown;
}

export interface CmsFieldObject {
  widget: 'object';
  default?: unknown;

  collapsed?: boolean;
  summary?: string;
  fields: CmsField[];
}

export interface CmsFieldList {
  widget: 'list';
  default?: unknown;

  allow_add?: boolean;
  collapsed?: boolean;
  summary?: string;
  minimize_collapsed?: boolean;
  label_singular?: string;
  field?: CmsField;
  fields?: CmsField[];
  max?: number;
  min?: number;
  add_to_top?: boolean;
  types?: (CmsFieldBase & CmsFieldObject)[];
}

export interface CmsFieldMap {
  widget: 'map';
  default?: string;

  decimals?: number;
  type?: CmsMapWidgetType;
}

export interface CmsFieldMarkdown {
  widget: 'markdown';
  default?: string;

  minimal?: boolean;
  buttons?: CmsMarkdownWidgetButton[];
  editor_components?: string[];
  modes?: ('raw' | 'rich_text')[];

  /**
   * @deprecated Use editor_components instead
   */
  editorComponents?: string[];
}

export interface CmsFieldNumber {
  widget: 'number';
  default?: string | number;

  value_type?: 'int' | 'float';
  min?: number;
  max?: number;

  step?: number;
}

export interface CmsFieldSelect {
  widget: 'select';
  default?: string | string[];

  options: string[] | CmsSelectWidgetOptionObject[];
  multiple?: boolean;
  min?: number;
  max?: number;

  /**
   * Sveltia-specific
   */
  dropdown_threshold?: number;
}

export interface CmsFieldRelation {
  widget: 'relation';
  default?: string | string[];

  collection: string;
  value_field: string;
  search_fields?: string[];
  file?: string;
  display_fields?: string[];
  multiple?: boolean;
  options_length?: number;

  /**
   * @deprecated Use value_field instead
   */
  valueField?: string;
  /**
   * @deprecated Use search_fields instead
   */
  searchFields?: string[];
  /**
   * @deprecated Use display_fields instead
   */
  displayFields?: string[];
  /**
   * @deprecated Use options_length instead
   */
  optionsLength?: number;

  /**
   * Sveltia-only
   */
  dropdown_threshold?: number;
}

export interface CmsFieldHidden {
  widget: 'hidden';
  default?: unknown;
}

export interface CmsFieldStringOrText {
  // This is the default widget, so declaring its type is optional.
  widget?: 'string' | 'text';
  default?: string;
}

export interface CmsFieldMeta {
  name: string;
  label: string;
  widget: string;
  required: boolean;
  index_file: string;
  meta: boolean;
}

export type CmsField = CmsFieldBase &
  (
    | CmsFieldBoolean
    | CmsFieldCode
    | CmsFieldColor
    | CmsFieldDateTime
    | CmsFieldFileOrImage
    | CmsFieldList
    | CmsFieldMap
    | CmsFieldMarkdown
    | CmsFieldNumber
    | CmsFieldObject
    | CmsFieldRelation
    | CmsFieldSelect
    | CmsFieldHidden
    | CmsFieldStringOrText
    | CmsFieldMeta
  );

export interface CmsCollectionFile {
  name: string;
  label: string;
  file: string;
  fields: CmsField[];
  label_singular?: string;
  description?: string;
  preview_path?: string;
  preview_path_date_field?: string;
  i18n?: boolean | CmsI18nConfig;
  media_folder?: string;
  public_folder?: string;
}

export interface ViewFilter {
  label: string;
  field: string;
  pattern: string;
  id: string;
}

export interface ViewGroup {
  label: string;
  field: string;
  pattern: string;
  id: string;
}

export interface CmsCollection {
  name: string;
  label: string;
  label_singular?: string;
  description?: string;
  folder?: string;
  files?: CmsCollectionFile[];
  identifier_field?: string;
  summary?: string;
  slug?: string;
  preview_path?: string;
  preview_path_date_field?: string;
  create?: boolean;
  delete?: boolean;
  editor?: {
    preview?: boolean;
  };
  publish?: boolean;
  nested?: {
    depth: number;
  };
  type: 'file_based_collection' | 'folder_based_collection';
  meta?: { path?: { label: string; widget: string; index_file: string } };

  /**
   * It accepts the following values: yml, yaml, toml, json, md, markdown, html
   *
   * You may also specify a custom extension not included in the list above, by specifying the format value.
   */
  extension?: string;
  format?: `${CmsCollectionFormatType}`;

  frontmatter_delimiter?: string[] | string;
  fields?: CmsField[];
  filter?: { field: string; value: unknown };
  path?: string;
  media_folder?: string;
  public_folder?: string;
  sortable_fields?: string[];
  view_filters?: ViewFilter[];
  view_groups?: ViewGroup[];
  i18n?: boolean | CmsI18nConfig;

  /**
   * @deprecated Use sortable_fields instead
   */
  sortableFields?: string[];
}

export interface CmsBackend {
  name: CmsBackendType;
  auth_scope?: CmsAuthScope;
  open_authoring?: boolean;
  repo?: string;
  branch?: string;
  api_root?: string;
  site_domain?: string;
  base_url?: string;
  auth_endpoint?: string;
  cms_label_prefix?: string;
  squash_merges?: boolean;
  proxy_url?: string;
  commit_messages?: {
    create?: string;
    update?: string;
    delete?: string;
    uploadMedia?: string;
    deleteMedia?: string;
    openAuthoring?: string;
  };
}

export interface CmsSlug {
  encoding?: CmsSlugEncoding;
  clean_accents?: boolean;
  sanitize_replacement?: string;
}

export interface CmsLocalBackend {
  url?: string;
  allowed_hosts?: string[];
}

export type CmsMediaLibraryOptions = unknown; // TODO: type properly

export interface CmsMediaLibrary {
  name: string;
  config?: CmsMediaLibraryOptions;
}

export interface CmsConfig {
  backend: CmsBackend;
  collections: CmsCollection[];
  locale?: string;
  site_url?: string;
  display_url?: string;
  logo_url?: string;
  show_preview_links?: boolean;
  media_folder?: string;
  public_folder?: string;
  media_library?: CmsMediaLibrary;
  publish_mode?: CmsPublishMode;
  load_config_file?: boolean;
  integrations?: {
    hooks: string[];
    provider: string;
    collections?: '*' | string[];
    applicationID?: string;
    apiKey?: string;
    getSignedFormURL?: string;
  }[];
  slug?: CmsSlug;
  i18n?: CmsI18nConfig;
  local_backend?: boolean | CmsLocalBackend;
  editor?: {
    preview?: boolean;
  };
  // Sveltia-specific
  automatic_deployments?: boolean;
  omit_empty_optional_fields?: boolean;
  json?: {
    indent_style?: 'space' | 'tab';
    indent_size?: number;
  };
  yaml?: {
    quote?: 'single' | 'double';
    indent_size?: number;
  };
}
