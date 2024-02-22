import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>&{
    renderAs: "button";
}
type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>&{
    renderAs: "a";
}

type Props = ButtonProps | LinkProps;

export const Button = (props: Props) => {
    if(props.renderAs === "a" ){
        return(
            <a {...props}>
                {props.children}
            </a>
        );
    }
    return (
        <button {...props}>
            {props.children}
        </button>
    );
}