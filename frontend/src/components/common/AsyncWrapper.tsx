import EmptyState from "./EmptyState";

import ErrorState from "./ErrorState";


type Props = {

  loading: boolean;

  error: boolean;

  isEmpty?: boolean;

  emptyTitle?: string;

  emptyDescription?: string;

  errorTitle?: string;

  errorDescription?: string;

  children: React.ReactNode;
};


function AsyncWrapper({
  loading,
  error,
  isEmpty,
  emptyTitle,
  emptyDescription,
  errorTitle,
  errorDescription,
  children,
}: Props) {

  if (loading) {

    return null;
  }


  if (error) {

    return (

      <ErrorState
        title={
          errorTitle ??
          "Something went wrong"
        }
        description={
          errorDescription ??
          "Unable to load data"
        }
      />

    );
  }


  if (isEmpty) {

    return (

      <EmptyState
        title={
          emptyTitle ??
          "No data available"
        }
        description={
          emptyDescription ??
          "Nothing to display"
        }
      />

    );
  }


  return <>{children}</>;
}

export default AsyncWrapper;