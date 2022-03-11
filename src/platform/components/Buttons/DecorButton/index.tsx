import { Fade } from '@mui/material';
import { SampleTile } from 'platform/components/Tiles';
import { useWindowListener } from 'platform/hooks';
import { useState } from 'react';
import { EEvent, Transition } from 'shared/enums';
import './decorButton.scss';

export interface IDecorButtonP {
	Button: React.FC;
	hoverEffect?: boolean;
	showOnHover?: string[];
}

const DecorButton = ({ Button, hoverEffect = true, showOnHover = [] }: IDecorButtonP) => {
	const [showDecoration, setShowDecoration] = useState(false);

	useWindowListener(EEvent.CLICK, () => setShowDecoration(false));

	return (
		<div
			className="container"
			onMouseOver={() => setShowDecoration(hoverEffect && true)}
			onMouseOut={() => setShowDecoration(false)}
			// onMouseEnter={() => setShowDecoration(hoverEffect && true)}
			onMouseLeave={() => setShowDecoration(false)}
		>
			{hoverEffect && showOnHover[0] && (
				<Fade in={showDecoration} timeout={{ enter: Transition.MEDIUM, exit: Transition.FAST }}>
					<div>
						<SampleTile className={`left ${showDecoration ? 'show' : ''}`} card={showOnHover[0]} />
					</div>
				</Fade>
			)}
			<Button />
			{hoverEffect && showOnHover[2] && (
				<Fade in={showDecoration} timeout={{ enter: Transition.MEDIUM, exit: Transition.FAST }}>
					<div>
						<SampleTile className={`right ${showDecoration ? 'show' : ''}`} card={showOnHover[2]} />
					</div>
				</Fade>
			)}
		</div>
	);
};

export default DecorButton;
