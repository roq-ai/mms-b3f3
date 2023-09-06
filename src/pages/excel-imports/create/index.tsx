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

import { createExcelImport } from 'apiSdk/excel-imports';
import { excelImportValidationSchema } from 'validationSchema/excel-imports';
import { DeliveryNoteInterface } from 'interfaces/delivery-note';
import { getDeliveryNotes } from 'apiSdk/delivery-notes';
import { ExcelImportInterface } from 'interfaces/excel-import';

function ExcelImportCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ExcelImportInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createExcelImport(values);
      resetForm();
      router.push('/excel-imports');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ExcelImportInterface>({
    initialValues: {
      file_name: '',
      imported_at: new Date(new Date().toDateString()),
      item_limit: 0,
      delivery_note_id: (router.query.delivery_note_id as string) ?? null,
    },
    validationSchema: excelImportValidationSchema,
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
              label: 'Excel Imports',
              link: '/excel-imports',
            },
            {
              label: 'Create Excel Import',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Excel Import
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.file_name}
            label={'File Name'}
            props={{
              name: 'file_name',
              placeholder: 'File Name',
              value: formik.values?.file_name,
              onChange: formik.handleChange,
            }}
          />

          <FormControl id="imported_at" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Imported At
            </FormLabel>
            <DatePicker
              selected={formik.values?.imported_at ? new Date(formik.values?.imported_at) : null}
              onChange={(value: Date) => formik.setFieldValue('imported_at', value)}
            />
          </FormControl>

          <NumberInput
            label="Item Limit"
            formControlProps={{
              id: 'item_limit',
              isInvalid: !!formik.errors?.item_limit,
            }}
            name="item_limit"
            error={formik.errors?.item_limit}
            value={formik.values?.item_limit}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('item_limit', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
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
              onClick={() => router.push('/excel-imports')}
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
    entity: 'excel_import',
    operation: AccessOperationEnum.CREATE,
  }),
)(ExcelImportCreatePage);
