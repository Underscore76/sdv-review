export type ButtonVariant = "blue" | "red" | "green" | "gray" | "";

const ButtonVariantColors = {
  green:
    "bg-green-600 hover:bg-green-500 active:bg-green-700 focus-visible:outline-green-600",
  blue: "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 focus-visible:outline-blue-600",
  gray: "bg-gray-600 hover:bg-gray-500 active:bg-gray-700 focus-visible:outline-gray-600",
  red: "bg-red-600 hover:bg-red-500 active:bg-red-700 focus-visible:outline-red-600",
};

function joinClasses(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type ButtonProps = {
  variant?: ButtonVariant;
  onClick?: () => void;
  children: React.ReactNode;
  classNames?: string;
};

export default function Button(props: ButtonProps) {
  const { children, variant, classNames, onClick } = props;
  return (
    <button
      className={joinClasses(
        "min-w-16 rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        classNames
          ? classNames
          : variant
            ? ButtonVariantColors[variant]
            : ButtonVariantColors.gray,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
