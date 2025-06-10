declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      'ios-src'?: string;
      alt?: string;
      poster?: string;
      ar?: boolean;
      'ar-modes'?: string;
      'camera-controls'?: boolean;
      autoplay?: boolean;
      'shadow-intensity'?: string;
      loading?: 'auto' | 'lazy' | 'eager';
    };
  }
}
