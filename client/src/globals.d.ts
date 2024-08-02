declare module '*.svg' {
    export = string;
}

declare module '*.module.css' {
    interface IClassNames {
        [className: string]: string
    }
    const classNames: IClassNames;
    export = classNames;
}

type Brand<T> = string & {__brand: T};