import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getInvalidNoteById, updateInvalidNoteById } from 'apiSdk/invalid-notes';
import { invalidNoteValidationSchema } from 'validationSchema/invalid-notes';
import { InvalidNoteInterface } from 'interfaces/invalid-note';
import { DeliveryNoteInterface } from 'interfaces/delivery-note';
import { getDeliveryNotes } from 'apiSdk/delivery-notes';

function InvalidNoteEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<InvalidNoteInterface>(
    () => (id ? `/invalid-notes/${id}` : null),
    () => getInvalidNoteById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: InvalidNoteInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateInvalidNoteById(id, values);
      mutate(updated);
      resetForm();
      router.push('/invalid-notes');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<InvalidNoteInterface>({
    initialValues: data,
    validationSchema: invalidNoteValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Invalid Notes',
              link: '/invalid-notes',
            },
            {
              label: 'Update Invalid Note',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Invalid Note
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="invalidated_at" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Invalidated At
            </FormLabel>
            <DatePicker
              selected={formik.values?.invalidated_at ? new Date(formik.values?.invalidated_at) : null}
              onChange={(value: Date) => formik.setFieldValue('invalidated_at', value)}
            />
          </FormControl>

          <TextInput
            error={formik.errors.reason}
            label={'Reason'}
            props={{
              name: 'reason',
              placeholder: 'Reason',
              value: formik.values?.reason,
              onChange: formik.handleChange,
            }}
          />

          <AsyncSelect<DeliveryNoteInterface>
            formik={formik}
            name={'delivery_note_id'}
            label={'Select Delivery Note'}
            placeholder={'Select Delivery Note'}
            fetcher={getDeliveryNotes}
            labelField={'note_number'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/invalid-notes')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'invalid_note',
    operation: AccessOperationEnum.UPDATE,
  }),
)(InvalidNoteEditPage);
