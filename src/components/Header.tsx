type HeaderProps = {
  text: string;
  subtext?: string;
};

export default function Header(props: HeaderProps) {
  return (
    <header className="sticky top-0 bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {props.text}
        </h1>
        {props.subtext && (
          <p className="mt-1 text-sm font-medium text-gray-500">
            {props.subtext}
          </p>
        )}
      </div>
    </header>
  );
}
