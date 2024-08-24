
import React, { useState } from "react";
function TreeView({ data, onSelect, className, value }) {
    const [openItems, setOpenItems] = useState([]);
    const handleItemClick = (item) => {
        onSelect(item);
        handleItemToggle(item);
    };
    const handleItemToggle = (item) => {
        if (openItems.includes(item)) {
            setOpenItems(openItems.filter((i) => i !== item));
        } else {
            setOpenItems([...openItems, item]);
        }
    };
    const renderTree = (treeData) => {
        return treeData.map((item) => (
            <div key={item.id}>
                <div
                    className={`flex flex-row items-center p-2 border-b gap-4 cursor-pointer ${value === item.id ? 'bg-blue-100' : ''}`}
                    onClick={() => handleItemClick(item)}
                >
                    <div>{item.name}</div>
                    {item.children && (
                        <button onClick={() => handleItemToggle(item)}>
                            {openItems.includes(item) ? "-" : "+"}
                        </button>
                    )}
                </div>
                {item.children && (
                    <div className="ml-4">
                        {openItems.includes(item) && renderTree(item.children)}
                    </div>
                )}
            </div>
        ));
    };
    return <div
        className={className}
    >
        {renderTree(data)}
    </div>;
}
export default TreeView;
