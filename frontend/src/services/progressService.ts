export function connectProgressStream(
  onMessage: (
    data: any
  ) => void
) {

  const eventSource =
    new EventSource(
      "http://127.0.0.1:8000/api/documents/progress/stream"
    );

  eventSource.onmessage = (
    event
  ) => {

    try {

      const parsedData =
        JSON.parse(
          event.data
        );

      onMessage(
        parsedData
      );

    } catch (
      error
    ) {

      console.error(
        error
      );
    }
  };

  return eventSource;
}