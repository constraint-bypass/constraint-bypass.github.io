import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';
import fs from 'node:fs';
import path from 'node:path';

const tasksRoot = path.join(process.cwd(), 'results');

const versionPattern = /(\d{4})-(\d{2})-v(\d+)/i;

function getVersionSortKey(value: string): number | null {
  const match = value.match(versionPattern);
  if (!match) {
    return null;
  }
  const [, year, month, version] = match;
  return Number(year) * 100000 + Number(month) * 100 + Number(version);
}

function sortVersionsDesc(a: string, b: string): number {
  const aBase = path.basename(a, path.extname(a));
  const bBase = path.basename(b, path.extname(b));
  const aKey = getVersionSortKey(aBase);
  const bKey = getVersionSortKey(bBase);

  if (aKey !== null && bKey !== null) {
    return bKey - aKey;
  }

  return bBase.localeCompare(aBase);
}

function parseFrontMatter(raw: string): string | null {
  const frontMatter = raw.match(/^---\n([\s\S]*?)\n---/);
  return frontMatter ? frontMatter[1] : null;
}

function getFrontMatterValue(frontMatter: string, key: string): string | null {
  const keyLine = frontMatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!keyLine) {
    return null;
  }
  return keyLine[1].trim().replace(/^["']|["']$/g, '');
}

function getTaskMetaFromFrontMatter(filePath: string): {docId: string; order: number | null} {
  const raw = fs.readFileSync(filePath, 'utf8');
  const frontMatter = parseFrontMatter(raw);
  if (!frontMatter) {
    return {docId: path.basename(filePath, '.md'), order: null};
  }
  const docId = getFrontMatterValue(frontMatter, 'id') ?? path.basename(filePath, '.md');
  const orderValue = getFrontMatterValue(frontMatter, 'order');
  const order = orderValue !== null ? Number(orderValue) : null;
  return {docId, order: Number.isFinite(order) ? order : null};
}

const taskCategories = fs
  .readdirSync(tasksRoot, {withFileTypes: true})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b))
  .map((categoryName) => {
    const categoryPath = path.join(tasksRoot, categoryName);
    const items = fs
      .readdirSync(categoryPath, {withFileTypes: true})
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => {
        const fileName = entry.name;
        const filePath = path.join(categoryPath, fileName);
        const {docId, order} = getTaskMetaFromFrontMatter(filePath);
        return {fileName, docId, order};
      })
      .sort((a, b) => {
        if (a.order !== null && b.order !== null && a.order !== b.order) {
          return a.order - b.order;
        }
        if (a.order !== null && b.order === null) {
          return -1;
        }
        if (a.order === null && b.order !== null) {
          return 1;
        }
        return sortVersionsDesc(a.fileName, b.fileName);
      })
      .map(({docId}) => {
        return `${categoryName}/${docId}`;
      });

    return {
      type: 'category' as const,
      label: categoryName,
      collapsed: false,
      items,
    };
  })
  .filter((category) => category.items.length > 0);

const sidebars: SidebarsConfig = {
  tasksSidebar: ['index', ...taskCategories],
};

export default sidebars;
