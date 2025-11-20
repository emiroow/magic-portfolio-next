'use client';
import { Badge } from '@/components/ui/badge';
import useProjects from '@/hooks/dashboard/useProjects';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useState } from 'react';
import gregorian from 'react-date-object/calendars/gregorian';
import persian from 'react-date-object/calendars/persian';
import gregorian_en from 'react-date-object/locales/gregorian_en';
import persian_fa from 'react-date-object/locales/persian_fa';
import { GoPlus } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';
import DatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';
import 'react-multi-date-picker/styles/backgrounds/bg-gray.css';
import BlurFade from '../magicui/blur-fade';
import { Button } from '../ui/button';
import ImageCropperDialog from '../ui/image-cropper';
import { Input } from '../ui/input';
import Loading from '../ui/loading';
import { Textarea } from '../ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import ProjectCard from './Project-card';

const Projects = () => {
  const t = useTranslations('dashboard.projects');
  const tcrop = useTranslations('dashboard.crop');
  const locale = useLocale();
  const { theme } = useTheme();
  const BLUR_FADE_DELAY = 0.04;
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const availableIcons = [
    { value: 'github', label: 'GitHub', emoji: '🔗' },
    { value: 'demo', label: 'Demo', emoji: '🌐' },
    { value: 'figma', label: 'Figma', emoji: '🎨' },
    { value: 'website', label: 'Website', emoji: '🌍' },
    { value: 'api', label: 'API', emoji: '⚡' },
    { value: 'docs', label: 'Documentation', emoji: '📚' },
    { value: 'video', label: 'Video', emoji: '🎥' },
    { value: 'download', label: 'Download', emoji: '⬇️' },
  ];

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    control,
    getValues,
    formState: { errors, isDirty },
    onsubmit,
    btnLoading,
    isLoading,
    projects,
    isEdit,
    setIsEdit,
    deleteProject,
    isDeletingProject,
    editProject,
    uploadProjectImage,
    deleteUploadedProjectImage,
    imageShowFromUrlLoading,
    setImageShowFromUrlLoading,
    newTech,
    setNewTech,
    newLink,
    setNewLink,
    addTechnology,
    removeTechnology,
    addLink,
    removeLink,
    fileInputRef,
    resetMutation,
  } = useProjects();

  if (isLoading) return <Loading className="h-[50vh]" />;
  return (
    <section className="flex flex-col mb-20">
      <AnimatePresence mode="wait">
        {isEdit ? (
          // Edit & create form
          <motion.div
            key="edit-form"
            initial={{ opacity: 0, y: -15, scale: 0.97, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, scale: 0.97, filter: 'blur(6px)' }}
            transition={{
              duration: 0.1,
              type: 'spring',
              stiffness: 180,
              damping: 18,
            }}
          >
            <div className="flex flex-row justify-between items-center">
              <h3 className="text-xl font-bold mt-3">{getValues('_id') ? t('editProject') : t('createProject')}</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      reset();
                      resetMutation();
                      setIsEdit(false);
                    }}
                    variant={'secondary'}
                    size={'icon'}
                    className="size-8"
                  >
                    <IoMdClose className="text-red-700 text-lg" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('cancel')}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-4 mb-2 mt-5">
              {/* Image Upload Section */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">{t('projectImage')}</p>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="relative w-full sm:w-auto">
                    <div className="w-full h-48 sm:w-32 sm:h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg overflow-hidden flex items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors">
                      {getValues('image') ? (
                        <Image
                          src={getValues('image')}
                          alt="Project preview"
                          width={120}
                          height={120}
                          className="object-cover w-full h-full rounded-md"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <div className="text-muted-foreground text-2xl mb-1">📷</div>
                          <span className="text-muted-foreground text-xs">{t('noImage')}</span>
                        </div>
                      )}
                    </div>
                    {getValues('image') && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => deleteUploadedProjectImage.mutate()}
                        disabled={deleteUploadedProjectImage.isPending}
                      >
                        <IoMdClose className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    {!getValues('image') && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadProjectImage.isPending}
                          className="w-full sm:w-auto"
                        >
                          {uploadProjectImage.isPending ? (
                            <>
                              <Loading size="sm" className="mr-2" />
                              {t('uploading')}
                            </>
                          ) : (
                            <>📷 {t('uploadImage')}</>
                          )}
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = URL.createObjectURL(file);
                            setCropSrc(url);
                            setCropOpen(true);
                          }}
                          disabled={uploadProjectImage.isPending}
                        />
                        <p className="text-xs text-muted-foreground">{t('uploadImageHint')}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Cropper Dialog */}
              <ImageCropperDialog
                open={cropOpen}
                onOpenChange={v => {
                  setCropOpen(v);
                  if (!v && cropSrc) {
                    URL.revokeObjectURL(cropSrc);
                    setCropSrc(null);
                    if (fileInputRef.current) {
                      // reset input to allow picking the same file again
                      // @ts-ignore
                      fileInputRef.current.value = '';
                    }
                  }
                }}
                src={cropSrc}
                aspect={1}
                labels={{
                  title: tcrop('title'),
                  apply: tcrop('apply'),
                  cancel: t('cancel'),
                  zoom: tcrop('zoom'),
                  move: tcrop('move'),
                }}
                dir={locale === 'fa' ? 'rtl' : 'ltr'}
                isDark={theme === 'dark'}
                outputSize={512}
                onCropped={file => {
                  const formData = new FormData();
                  formData.append('image', file);
                  uploadProjectImage.mutate(formData);
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t('projectTitle')}</label>
                  <Input {...register('title')} placeholder={t('projectTitlePlaceholder')} className={errors.title ? 'border-red-500' : ''} />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t('projectUrl')}</label>
                  <Input {...register('href')} placeholder={t('projectUrlPlaceholder')} className={errors.href ? 'border-red-500' : ''} />
                  {errors.href && <p className="text-red-500 text-xs mt-1">{errors.href.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t('projectDates')}</label>
                  <DatePicker
                    range
                    onlyMonthPicker
                    className={`${theme === 'dark' ? 'bg-dark' : 'bg-muted'}`}
                    onChange={(dates: any) => {
                      if (dates && dates.length === 2) {
                        const [start, end] = dates;
                        const formattedRange = `${start.format('MMMM YYYY')} - ${end.format('MMMM YYYY')}`;
                        setValue('dates', formattedRange);
                      } else if (dates && dates.length === 1) {
                        setValue('dates', dates[0].format('MMMM YYYY'));
                      } else {
                        setValue('dates', '');
                      }
                    }}
                    calendar={locale === 'fa' ? persian : gregorian}
                    locale={locale === 'fa' ? persian_fa : gregorian_en}
                    format="MMMM YYYY"
                    placeholder={t('projectDatesPlaceholder')}
                    containerStyle={{ width: '100%' }}
                    style={{
                      width: '100%',
                      fontSize: '10px',
                      height: '36px',
                      borderRadius: '6px',
                      border: errors.dates ? '1px solid rgb(239 68 68)' : '1px solid hsl(var(--input))',
                      padding: '0 12px',
                      backgroundColor: 'hsl(var(--background))',
                      color: 'hsl(var(--foreground))',
                    }}
                    inputClass={errors.dates ? 'border-red-500' : ''}
                  />
                  {errors.dates && <p className="text-red-500 text-xs mt-1">{errors.dates.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t('projectDescription')}</label>
                <Textarea
                  {...register('description')}
                  placeholder={t('projectDescriptionPlaceholder')}
                  className={errors.description ? 'border-red-500' : ''}
                  rows={3}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">{t('technologies')}</label>
                <div className="flex gap-2">
                  <Input
                    value={newTech}
                    onChange={e => setNewTech(e.target.value)}
                    placeholder={t('technologyPlaceholder')}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  />
                  <Button type="button" onClick={addTechnology} size="sm" className="shrink-0">
                    <GoPlus className="h-4 w-4 mr-1" />
                    {t('add')}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(getValues('technologies') || []).map((tech, index) => (
                    <Badge key={index} onDelete={() => removeTechnology(index)}>
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Links Management */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">{t('projectLinks')}</label>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 min-w-0">
                      <select
                        value={newLink.type}
                        onChange={e => {
                          const selectedIcon = availableIcons.find(icon => icon.value === e.target.value);
                          setNewLink({
                            ...newLink,
                            type: e.target.value,
                            icon: selectedIcon?.value || '',
                          });
                        }}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">{t('selectLinkType')}</option>
                        {availableIcons.map(icon => (
                          <option key={icon.value} value={icon.value}>
                            {icon.emoji} {icon.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Input
                        value={newLink.href}
                        onChange={e => setNewLink({ ...newLink, href: e.target.value })}
                        placeholder={t('linkUrlPlaceholder')}
                        type="url"
                      />
                    </div>
                    <Button type="button" onClick={addLink} size="sm" disabled={!newLink.type || !newLink.href} className="shrink-0 w-full sm:w-auto">
                      <GoPlus className="h-4 w-4 mr-1" />
                      {t('add')}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(getValues('links') || []).map((link, index) => {
                    const iconInfo = availableIcons.find(icon => icon.value === link.icon);
                    return (
                      <Badge key={index} onDelete={() => removeLink(index)} className="flex items-center gap-1">
                        <span className="text-xs">{iconInfo?.emoji}</span>
                        {link.type}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" {...register('active')} id="active" />
                <label htmlFor="active" className="text-sm font-medium">
                  {t('active')}
                </label>
              </div>

              <div className="flex gap-2 max-sm:flex-col mt-4">
                <Button type="submit" disabled={btnLoading} className="w-full sm:w-auto">
                  {btnLoading ? <Loading size="sm" /> : getValues('_id') ? t('update') : t('create')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    resetMutation();
                    setIsEdit(false);
                  }}
                  className="w-full sm:w-auto"
                >
                  {t('cancel')}
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          // Projects list
          <motion.div
            key="projects-list"
            initial={{ opacity: 0, y: 15, scale: 0.97, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 15, scale: 0.97, filter: 'blur(6px)' }}
            transition={{
              duration: 0.1,
              type: 'spring',
              stiffness: 180,
              damping: 18,
            }}
          >
            <div className="flex flex-row justify-between items-center">
              <h3 className="text-xl font-bold mt-3">{t('title')}</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => setIsEdit(true)} variant={'secondary'} size={'icon'} className="size-8">
                    <GoPlus className="text-lg text-green-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('addProject')}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="space-y-4 mt-5">
              {projects?.map((project: any, index: number) => (
                <BlurFade key={project._id} delay={BLUR_FADE_DELAY * 2 + index * 0.05}>
                  <ProjectCard project={project} onEdit={editProject} onDelete={deleteProject} isDeleting={isDeletingProject} />
                </BlurFade>
              ))}
            </div>

            {(!projects || projects.length === 0) && (
              <div className="text-center py-8 mt-24">
                <p className="text-muted-foreground">{t('noProjects')}</p>
                <Button onClick={() => setIsEdit(true)} variant="outline" className="mt-2">
                  {t('createFirstProject')}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
