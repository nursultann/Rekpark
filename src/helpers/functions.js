import { get } from "jquery";

const getTextContentOnly = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const walker = document.createTreeWalker(
        doc.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    const texts = [];
    let node;
    while (node = walker.nextNode()) {
        texts.push(node.nodeValue);
    }
    return texts;
}

function maxSymbolEllipsis(str, maxLength) {
    str = getTextContentOnly(str).join(' ');
    if (str.length > maxLength) {
        return str.slice(0, maxLength) + '...';
    }
    return str;
}

function filterCategoriesByParentId(categories, parentId = null) {
    return categories.filter(category => category.parent_id == parentId);
}

function filterCategoriesByParentIdRecursive(categories, parentId = null) {
    const filteredCategories = filterCategoriesByParentId(categories, parentId);
    return filteredCategories.map(category => {
        category.children = filterCategoriesByParentIdRecursive(categories, category.id);
        return category;
    });
}

export {
    maxSymbolEllipsis,
    getTextContentOnly,
    filterCategoriesByParentIdRecursive
}
