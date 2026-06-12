/**
 * Container Component
 *
 * Purpose:
 * Provides a consistent width and spacing
 * across the entire application.
 *
 * Usage:
 * <Container>
 *   Content
 * </Container>
 */

const Container = ({ children, className = "" }) => {
  return (
    <div
      className={`
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Container;