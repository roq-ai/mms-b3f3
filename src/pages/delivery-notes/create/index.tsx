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
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createDeliveryNote } from 'apiSdk/delivery-notes';
import { deliveryNoteValidationSchema } from 'validationSchema/delivery-notes';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';
import { DeliveryNoteInterface } from 'interfaces/delivery-note';

function DeliveryNoteCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: DeliveryNoteInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createDeliveryNote(values);
      resetForm();
      router.push('/delivery-notes');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<DeliveryNoteInterface>({
    initialValues: {
      note_number: '',
      issuer: '',
      addressee: '',
      company_id: (router.query.company_id as string) ?? null,
    },
    validationSchema: deliveryNoteValidationSchema,
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
              label: 'Delivery Notes',
              link: '/delivery-notes',
            },
            {
              label: 'Create Delivery Note',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Delivery Note
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.note_number}
            label={'Note Number'}
            props={{
              name: 'note_number',
              placeholder: 'Note Number',
              value: formik.values?.note_number,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.issuer}
            label={'Issuer'}
            props={{
              name: 'issuer',
              placeholder: 'Issuer',
              value: formik.values?.issuer,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.addressee}
            label={'Addressee'}
            props={{
              name: 'addressee',
              placeholder: 'Addressee',
              value: formik.values?.addressee,
              onChange: formik.handleChange,
            }}
          />

          <AsyncSelect<CompanyInterface>
            formik={formik}
            name={'company_id'}
            label={'Select Company'}
            placeholder={'Select Company'}
            fetcher={getCompanies}
            labelField={'name'}
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
              onClick={() => router.push('/delivery-notes')}
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
    entity: 'delivery_note',
    operation: AccessOperationEnum.CREATE,
  }),
)(DeliveryNoteCreatePage);
