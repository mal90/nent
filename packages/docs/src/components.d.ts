/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface XDocLog {
    }
}
declare global {
    interface HTMLXDocLogElement extends Components.XDocLog, HTMLStencilElement {
    }
    var HTMLXDocLogElement: {
        prototype: HTMLXDocLogElement;
        new (): HTMLXDocLogElement;
    };
    interface HTMLElementTagNameMap {
        "x-doc-log": HTMLXDocLogElement;
    }
}
declare namespace LocalJSX {
    interface XDocLog {
    }
    interface IntrinsicElements {
        "x-doc-log": XDocLog;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "x-doc-log": LocalJSX.XDocLog & JSXBase.HTMLAttributes<HTMLXDocLogElement>;
        }
    }
}
