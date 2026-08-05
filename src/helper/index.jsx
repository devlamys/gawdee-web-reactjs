/* Developed by Grafizen International PVT. LTD. */
import { enqueueSnackbar } from "notistack";

export const toast = (SankD,variant) => {
    enqueueSnackbar(SankD, {
      autoHideDuration: 5000,
      variant: variant || 'default'
    });
  };