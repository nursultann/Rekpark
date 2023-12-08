import React from "react";

function Column({ mainAxis = "start", crossAxis = "center", children, ...props }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: mainAxis,
                alignItems: crossAxis,
                height: "100%",
            }}
            {...props}
        >
            {children.map((child, index) => (
                <div key={index} style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: mainAxis,
                    alignItems: crossAxis,
                }}>{child}</div>
            ))}
        </div>
    );
}

function Row({ mainAxis = "start", crossAxis = "center", children, ...props }) {
    const rowStyle = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: mainAxis,
        alignItems: crossAxis,
        height: '100%',
        width: '100%',
    };

    return (
        <div
            style={rowStyle}
            {...props}
        >

            {React.Children.map(children, (child) => {
                const childStyle = {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: crossAxis,
                    height: '100%',
                };
                return <div style={childStyle}>{child}</div>;
            })}
        </div>
    );
}

// class Row extends React.Component {
//     render() {
//       const { mainAxisAlignment = 'start', crossAxisAlignment = 'center', children } = this.props;
//       const rowStyle = {
//         display: 'flex',
//         flexDirection: 'row',
//         justifyContent: mainAxisAlignment,
//         alignItems: crossAxisAlignment,
//         height: '100%',
//         width: '100%',
//       };

//       return (
//         <div style={rowStyle}>
//           {React.Children.map(children, (child) => {
//             const childStyle = {
//               display: 'flex',
//               flexDirection: 'row',
//               justifyContent: 'center',
//               alignItems: crossAxisAlignment,
//               height: '100%',
//             };
//             return <div style={childStyle}>{child}</div>;
//           })}
//         </div>
//       );
//     }
//   }

function Spacer() {
    return <div style={{ flexGrow: 1 }} />;
}

function Box({ width = "100%", height = "0px", children, ...props }) {
    return (
        <div
            style={{
                width: width,
                height: height,
            }}
            {...props}
        >
            {children}
        </div>
    );
}

function ListViewBuilder({ items, builder, direction = "vertical", ...props }) {
    if (direction === "horizontal") {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "start",
                    overflowX: "scroll",
                    height: "100%",
                }}
                {...props}
            >
                {items.map((item, index) => (
                    <div key={index} style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "stretch",
                        height: "100%",
                    }}>{builder(item)}</div>
                ))}
            </div>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "stretch",
                height: "100%",
            }}
            {...props}
        >
            {items.map((item, index) => (
                <div key={index} style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "stretch",
                }}>{builder(item)}</div>
            ))}
        </div>
    );
}

function Expanded({ direction = "horizontal", children, ...props }) {
    return (
        <div
            style={{
                flexGrow: 1,
                flexDirection: direction === "horizontal" ? "row" : "column",
                justifyContent: "flex-start",
                alignItems: "start",
                overflowX: "scroll",
            }}
            {...props}
        >
            {children}
        </div>
    );
}

export { Column, Row, Spacer, Box, ListViewBuilder, Expanded };