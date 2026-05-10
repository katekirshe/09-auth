type Props = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

const AuthLayout = (props: Props) => {
  const { children } = props;

  return (
    <section>
      <div>{children}</div>
    </section>
  );
};

export default AuthLayout;
