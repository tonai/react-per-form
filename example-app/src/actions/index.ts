'use server';

let submissions = 0;

export async function serverAction(
  _prevState: {
    message: string;
  },
  formData: FormData,
): Promise<{ message: string }> {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  submissions++;
  return {
    message: `This form has been submitted ${submissions} time(s) in total and the last value submitted is "${String(formData.get('foo'))}"`,
  };
}
